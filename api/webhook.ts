
/**
 * Vercel Serverless Function: Kuenha Webhook Handler
 * Este arquivo processa o pagamento e automatiza o onboarding.
 */

import { createNewAccessKey } from '../services/authService';
import { sendAccessEmail } from '../services/emailService';

// Configurações de Ambiente
const KUENHA_SECRET = process.env.KUENHA_WEB_SECRET;

export default async function handler(req: any, res: any) {
  // 1. Validar Método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // 2. Validar Autenticidade (Segurança)
  // O Kuenha geralmente envia um token no header ou body
  const token = req.headers['x-kuenha-token'] || req.body.secret;
  if (KUENHA_SECRET && token !== KUENHA_SECRET) {
    console.error("Tentativa de acesso não autorizada ao Webhook.");
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const { 
      status, 
      customer_email, 
      customer_name, 
      transaction_id,
      event_type 
    } = req.body;

    // 3. Filtrar apenas pagamentos aprovados
    // Nota: Verifique os nomes exatos dos campos na documentação do Kuenha
    const isApproved = status === 'paid' || status === 'completed' || event_type === 'ORDER_PAID';

    if (!isApproved) {
      console.log(`Pagamento ${transaction_id} ainda não aprovado (Status: ${status}).`);
      return res.status(200).json({ received: true });
    }

    console.log(`Processando acesso para: ${customer_email}`);

    // 4. Gerar Chave de Acesso
    // NOTA PARA PRODUÇÃO: Como funções serverless não acessam o localStorage,
    // aqui você chamaria sua API de Banco de Dados (ex: Supabase) para persistir a chave.
    const newKey = createNewAccessKey(
      customer_name || 'Cliente Kuenha', 
      'USER', 
      customer_email
    );

    // 5. Enviar Email via Resend
    const emailResult = await sendAccessEmail(
      customer_email, 
      newKey.password, 
      customer_name || 'Cliente'
    );

    if (emailResult.success) {
      console.log(`Acesso enviado com sucesso para ${customer_email}`);
      return res.status(200).json({ 
        success: true, 
        message: 'Acesso gerado e enviado.' 
      });
    } else {
      throw new Error("Falha no envio do email.");
    }

  } catch (error: any) {
    console.error("Erro no processamento do Webhook:", error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
