
/**
 * Serviço de Email Transacional via Resend
 * Envia credenciais de acesso de forma segura e profissional.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export const sendAccessEmail = async (to: string, password: string, userName: string) => {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY não configurada. O email não será enviado.");
    return { success: false, error: "Configuração ausente" };
  }

  const appLink = window.location.origin;

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao Kanva.ao</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #0f172a; padding: 50px 40px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1.5px;">K.</h1>
                  <p style="color: #94a3b8; font-size: 14px; font-weight: 700; margin-top: 12px; text-transform: uppercase; letter-spacing: 2px;">Kanva.ao Workspace</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 24px; letter-spacing: -0.5px;">Olá, ${userName}!</h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    É um prazer receber você no <strong>Kanva.ao</strong>. Sua área de trabalho privada e inteligente foi configurada com sucesso. 
                    A partir de agora, você tem acesso a um ecossistema exclusivo para organizar ideias, gerar briefings e criar designs de alta fidelidade com inteligência artificial.
                  </p>

                  <div style="background-color: #fff7ed; border: 2px dashed #ffedd5; border-radius: 20px; padding: 30px; text-align: center; margin-bottom: 35px;">
                    <p style="color: #9a3412; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 0;">Sua Chave Mestra Privada</p>
                    <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 26px; font-weight: 800; color: #ea580c; letter-spacing: 3px;">
                      ${password}
                    </div>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${appLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 16px; transition: all 0.2s;">
                          Acessar meu Workspace →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f1f5f9; text-align: left;">
                    <p style="color: #64748b; font-size: 13px; font-weight: 500; line-height: 1.5;">
                      <strong>Aviso de Segurança:</strong> Este é um ambiente estritamente privado. Sua chave de acesso é pessoal e não deve ser compartilhada. O sistema rastreia logs de acesso para garantir a integridade dos dados.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="color: #94a3b8; font-size: 12px; font-weight: 600; margin: 0;">
                    &copy; 2025 Kanva.ao Intelligence Labs. <br/>
                    Sistema de Gerenciamento de Identidade Ativa.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kanva.ao <onboarding@resend.dev>", 
        to: [to],
        subject: "🔑 Sua chave mestra do Kanva.ao chegou!",
        html: emailHtml,
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Erro ao enviar email via Resend:", error);
    return { success: false, error };
  }
};
