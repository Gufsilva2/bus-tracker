import { describe, it, expect, beforeEach } from "vitest";
import { AdminRobot, createAdminRobot } from "./admin-robot";

describe("AdminRobot", () => {
  let robot: AdminRobot;

  beforeEach(() => {
    robot = createAdminRobot();
  });

  it("deve gerar relatório diário", () => {
    const tarefa = robot.gerarRelatorioDiario();

    expect(tarefa.tipo).toBe("relatorio");
    expect(tarefa.status).toBe("concluido");
    expect(tarefa.resultado).toBeDefined();
  });

  it("deve verificar anúncios expirando", () => {
    const tarefa = robot.verificarAnunciosExpirando();

    expect(tarefa.tipo).toBe("alerta");
    expect(tarefa.status).toBe("concluido");
  });

  it("deve processar cobranças", () => {
    const tarefa = robot.processarCobrancas();

    expect(tarefa.tipo).toBe("cobranca");
    expect(tarefa.status).toBe("concluido");
  });

  it("deve limpar dados antigos", () => {
    const tarefa = robot.limparDadosAntigos();

    expect(tarefa.tipo).toBe("limpeza");
    expect(tarefa.status).toBe("concluido");
  });

  it("deve executar todas as tarefas diárias", () => {
    const tarefas = robot.executarTarefasDiarias();

    expect(tarefas.length).toBe(4);
    expect(tarefas.every((t) => t.status === "concluido")).toBe(true);
  });

  it("deve gerar relatório semanal", () => {
    const tarefa = robot.gerarRelatorioSemanal();

    expect(tarefa.tipo).toBe("relatorio");
    expect(tarefa.status).toBe("concluido");
  });

  it("deve gerar relatório mensal", () => {
    const tarefa = robot.gerarRelatorioMensal();

    expect(tarefa.tipo).toBe("relatorio");
    expect(tarefa.status).toBe("concluido");
  });

  it("deve retornar histórico de tarefas", () => {
    robot.gerarRelatorioDiario();
    robot.verificarAnunciosExpirando();

    const historico = robot.getHistoricoTarefas();

    expect(historico.length).toBe(2);
  });

  it("deve retornar tarefas com erro", () => {
    const tarefasComErro = robot.getTarefasComErro();

    expect(Array.isArray(tarefasComErro)).toBe(true);
  });

  it("deve permitir subscrição a notificações", () => {
    let notificacoes = 0;

    robot.subscribe(() => {
      notificacoes++;
    });

    robot.gerarRelatorioDiario();

    expect(notificacoes).toBe(1);
  });

  it("deve retornar configuração", () => {
    const config = robot.getConfig();

    expect(config.emailAdmin).toBe("admin@bustracker.com.br");
    expect(config.frequenciaRelatorio).toBe("diario");
  });
});
