export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Teste básico do Worker
    if (url.pathname === "/api/teste") {
      return new Response("Worker funcionando!", {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8"
        }
      });
    }

    // Teste da conexão com o banco D1
    if (url.pathname === "/api/teste-db") {
      try {
        const resultado = await env.DB
          .prepare("SELECT COUNT(*) AS total FROM mensagens")
          .first();

        return new Response(
          `Banco conectado. Mensagens armazenadas: ${resultado.total}`,
          {
            headers: {
              "Content-Type": "text/plain; charset=UTF-8"
            }
          }
        );

      } catch (erro) {
        return new Response(
          `Erro ao acessar o banco: ${erro.message}`,
          {
            status: 500,
            headers: {
              "Content-Type": "text/plain; charset=UTF-8"
            }
          }
        );
      }
    }

    // Teste de gravação no banco D1
    if (url.pathname === "/api/teste-gravar" && request.method === "POST") {
      try {
        const resultado = await env.DB
          .prepare(`
            INSERT INTO mensagens (nome, email, mensagem)
            VALUES (?, ?, ?)
          `)
          .bind(
            "Teste",
            "teste@example.com",
            "Registro de teste do formulário"
          )
          .run();

        return new Response(
          `Registro criado. ID: ${resultado.meta.last_row_id}`,
          {
            headers: {
              "Content-Type": "text/plain; charset=UTF-8"
            }
          }
        );

      } catch (erro) {
        return new Response(
          `Erro ao gravar no banco: ${erro.message}`,
          {
            status: 500,
            headers: {
              "Content-Type": "text/plain; charset=UTF-8"
            }
          }
        );
      }
    }

    // Todos os demais arquivos continuam sendo servidos
    // normalmente pelos Static Assets.
    return env.ASSETS.fetch(request);
  }
};