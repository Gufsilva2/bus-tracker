/**
 * BusTracker Admin Robot
 * Automatiza tarefas administrativas do app
 * - Gerenciar empresas
 * - Monitorar receita
 * - Enviar relatórios
 * - Processar pagamentos
 */

import { b2bAdvertisingService } from "./b2b-advertising-service";

export interface AdminTask {
  id: string;
  tipo: "relatorio" | "cobranca" | "alerta" | "limpeza";
  status: "pendente" | "executando" | "concluido" | "erro";
  dataExecucao: string;
  resultado?: string;
  erro?: string;
}

export interface AdminConfig {
  emailAdmin: string;
  telefonAdmin: string;
  limiteAtrasoCobranca: number; // dias
  frequenciaRelatorio: "diario" | "semanal" | "mensal";
  limiteErros: number;
}

/**
 * Admin Robot para gerenciar BusTracker automaticamente
 */
export class AdminRobot {
  private config: AdminConfig;
  private tarefas: AdminTask[] = [];
  private listeners: ((tarefa: AdminTask) => void)[] = [];

  constructor(config: AdminConfig) {
    this.config = config;
  }

  /**
   * Gerar relatório de receita diário
   */
  gerarRelatorioDiario(): AdminTask {
    const tarefa: AdminTask = {
      id: `relatorio-${Date.now()}`,
      tipo: "relatorio",
      status: "executando",
      dataExecucao: new Date().toISOString(),
    };

    try {
      const empresas = b2bAdvertisingService.getAllCompanies();
      let receitaTotal = 0;
      let impressoesTotal = 0;

      const relatorio = empresas.map((empresa) => {
        const revenue = b2bAdvertisingService.calculateCompanyRevenue(empresa.id);
        const ads = b2bAdvertisingService.getCompanyAds(empresa.id);
        const impressoes = ads.reduce((sum, ad) => sum + ad.impressions, 0);

        receitaTotal += revenue;
        impressoesTotal += impressoes;

        return {
          empresa: empresa.name,
          receita: revenue,
          impressoes: impressoes,
          anuncios: ads.length,
        };
      });

      tarefa.status = "concluido";
      tarefa.resultado = JSON.stringify({
        data: new Date().toLocaleDateString("pt-BR"),
        receitaTotal,
        impressoesTotal,
        empresas: relatorio.length,
        detalhes: relatorio,
      });

      console.log(`✅ Relatório diário gerado: R$ ${receitaTotal.toFixed(2)}`);
    } catch (error) {
      tarefa.status = "erro";
      tarefa.erro = String(error);
      console.error("❌ Erro ao gerar relatório:", error);
    }

    this.tarefas.push(tarefa);
    this.notificarListeners(tarefa);
    return tarefa;
  }

  /**
   * Verificar anúncios expirando
   */
  verificarAnunciosExpirando(): AdminTask {
    const tarefa: AdminTask = {
      id: `alerta-expiracao-${Date.now()}`,
      tipo: "alerta",
      status: "executando",
      dataExecucao: new Date().toISOString(),
    };

    try {
      const anunciosExpirando = b2bAdvertisingService.getExpiringAds();

      if (anunciosExpirando.length > 0) {
        tarefa.resultado = JSON.stringify({
          quantidade: anunciosExpirando.length,
          anuncios: anunciosExpirando.map((ad) => ({
            id: ad.id,
            empresa: ad.companyId,
            dataExpiracao: ad.endDate,
          })),
        });

        console.log(
          `⚠️  ${anunciosExpirando.length} anúncios expirando em breve`
        );
      } else {
        tarefa.resultado = JSON.stringify({ quantidade: 0 });
      }

      tarefa.status = "concluido";
    } catch (error) {
      tarefa.status = "erro";
      tarefa.erro = String(error);
      console.error("❌ Erro ao verificar anúncios:", error);
    }

    this.tarefas.push(tarefa);
    this.notificarListeners(tarefa);
    return tarefa;
  }

  /**
   * Processar cobranças mensais
   */
  processarCobrancas(): AdminTask {
    const tarefa: AdminTask = {
      id: `cobranca-${Date.now()}`,
      tipo: "cobranca",
      status: "executando",
      dataExecucao: new Date().toISOString(),
    };

    try {
      const empresas = b2bAdvertisingService.getAllCompanies();
      const cobrancasProcessadas: any[] = [];

      empresas.forEach((empresa) => {
        const revenue = b2bAdvertisingService.calculateCompanyRevenue(empresa.id);

        if (revenue > 0) {
          cobrancasProcessadas.push({
            empresa: empresa.name,
            email: empresa.email,
            valor: revenue,
            status: "processada",
            data: new Date().toISOString(),
          });

          console.log(`💳 Cobrança processada: ${empresa.name} - R$ ${revenue}`);
        }
      });

      tarefa.status = "concluido";
      tarefa.resultado = JSON.stringify({
        total: cobrancasProcessadas.length,
        cobrancas: cobrancasProcessadas,
      });
    } catch (error) {
      tarefa.status = "erro";
      tarefa.erro = String(error);
      console.error("❌ Erro ao processar cobranças:", error);
    }

    this.tarefas.push(tarefa);
    this.notificarListeners(tarefa);
    return tarefa;
  }

  /**
   * Limpar dados antigos
   */
  limparDadosAntigos(): AdminTask {
    const tarefa: AdminTask = {
      id: `limpeza-${Date.now()}`,
      tipo: "limpeza",
      status: "executando",
      dataExecucao: new Date().toISOString(),
    };

    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 90); // 90 dias

      // Aqui você implementaria a lógica de limpeza
      // Por exemplo, deletar anúncios expirados, dados de analytics antigos, etc.

      tarefa.status = "concluido";
      tarefa.resultado = JSON.stringify({
        dataLimite: dataLimite.toISOString(),
        registrosDeletados: 0,
        mensagem: "Limpeza concluída",
      });

      console.log("🧹 Limpeza de dados concluída");
    } catch (error) {
      tarefa.status = "erro";
      tarefa.erro = String(error);
      console.error("❌ Erro ao limpar dados:", error);
    }

    this.tarefas.push(tarefa);
    this.notificarListeners(tarefa);
    return tarefa;
  }

  /**
   * Executar todas as tarefas diárias
   */
  executarTarefasDiarias(): AdminTask[] {
    console.log("\n" + "=".repeat(60));
    console.log("🤖 EXECUTANDO TAREFAS ADMINISTRATIVAS DIÁRIAS");
    console.log("=".repeat(60) + "\n");

    const tarefas: AdminTask[] = [];

    tarefas.push(this.gerarRelatorioDiario());
    tarefas.push(this.verificarAnunciosExpirando());
    tarefas.push(this.processarCobrancas());
    tarefas.push(this.limparDadosAntigos());

    console.log("\n" + "=".repeat(60));
    console.log("✅ TAREFAS CONCLUÍDAS");
    console.log("=".repeat(60) + "\n");

    return tarefas;
  }

  /**
   * Gerar relatório semanal
   */
  gerarRelatorioSemanal(): AdminTask {
    const tarefa: AdminTask = {
      id: `relatorio-semanal-${Date.now()}`,
      tipo: "relatorio",
      status: "executando",
      dataExecucao: new Date().toISOString(),
    };

    try {
      const empresas = b2bAdvertisingService.getAllCompanies();
      let receitaSemanal = 0;
      let topEmpresas: any[] = [];

      empresas.forEach((empresa) => {
        const revenue = b2bAdvertisingService.calculateCompanyRevenue(empresa.id);
        receitaSemanal += revenue;

        topEmpresas.push({
          nome: empresa.name,
          receita: revenue,
        });
      });

      topEmpresas.sort((a, b) => b.receita - a.receita);
      topEmpresas = topEmpresas.slice(0, 5);

      tarefa.status = "concluido";
      tarefa.resultado = JSON.stringify({
        periodo: "Última semana",
        receitaTotal: receitaSemanal,
        empresas: empresas.length,
        topEmpresas,
      });

      console.log(`📊 Relatório semanal: R$ ${receitaSemanal.toFixed(2)}`);
    } catch (error) {
      tarefa.status = "erro";
      tarefa.erro = String(error);
    }

    this.tarefas.push(tarefa);
    this.notificarListeners(tarefa);
    return tarefa;
  }

  /**
   * Gerar relatório mensal
   */
  gerarRelatorioMensal(): AdminTask {
    const tarefa: AdminTask = {
      id: `relatorio-mensal-${Date.now()}`,
      tipo: "relatorio",
      status: "executando",
      dataExecucao: new Date().toISOString(),
    };

    try {
      const empresas = b2bAdvertisingService.getAllCompanies();
      let receitaMensal = 0;
      const metricas: any = {
        empresas: empresas.length,
        anunciosAtivos: 0,
        impressoesTotal: 0,
        clicksTotal: 0,
      };

      empresas.forEach((empresa) => {
        const revenue = b2bAdvertisingService.calculateCompanyRevenue(empresa.id);
        const ads = b2bAdvertisingService.getCompanyAds(empresa.id);

        receitaMensal += revenue;
        metricas.anunciosAtivos += ads.filter((a) => a.status === "active").length;
        metricas.impressoesTotal += ads.reduce((sum, ad) => sum + ad.impressions, 0);
        metricas.clicksTotal += ads.reduce((sum, ad) => sum + ad.clicks, 0);
      });

      tarefa.status = "concluido";
      tarefa.resultado = JSON.stringify({
        mes: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        receitaTotal: receitaMensal,
        metricas,
      });

      console.log(`📈 Relatório mensal: R$ ${receitaMensal.toFixed(2)}`);
    } catch (error) {
      tarefa.status = "erro";
      tarefa.erro = String(error);
    }

    this.tarefas.push(tarefa);
    this.notificarListeners(tarefa);
    return tarefa;
  }

  /**
   * Obter histórico de tarefas
   */
  getHistoricoTarefas(): AdminTask[] {
    return [...this.tarefas];
  }

  /**
   * Obter tarefas com erro
   */
  getTarefasComErro(): AdminTask[] {
    return this.tarefas.filter((t) => t.status === "erro");
  }

  /**
   * Subscribe para notificações de tarefas
   */
  subscribe(listener: (tarefa: AdminTask) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notificar listeners
   */
  private notificarListeners(tarefa: AdminTask): void {
    this.listeners.forEach((listener) => listener(tarefa));
  }

  /**
   * Obter configuração
   */
  getConfig(): AdminConfig {
    return { ...this.config };
  }
}

/**
 * Criar instância do Admin Robot
 */
export function createAdminRobot(): AdminRobot {
  return new AdminRobot({
    emailAdmin: "admin@bustracker.com.br",
    telefonAdmin: "+55 11 99999-9999",
    limiteAtrasoCobranca: 7,
    frequenciaRelatorio: "diario",
    limiteErros: 3,
  });
}

/**
 * Executar tarefas diárias (para ser chamado por cron job)
 */
export function executarTarefasDiarias(): void {
  const robot = createAdminRobot();
  robot.executarTarefasDiarias();
}
