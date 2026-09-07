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
    //Teste de conexão do Worker
    if (url.pathname === "/api/versao") {
      return new Response("Versão 2 do Worker", {
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

    // Todos os demais arquivos continuam sendo servidos
    // normalmente pelos Static Assets.
    return env.ASSETS.fetch(request);
  }
};