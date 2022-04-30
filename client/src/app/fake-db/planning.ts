export class PlanningFakeDb {
    public static questions = [
        {
            id: "15459251a6d6b397565",
            title: "Basics of Angular",
            slug: "basics-of-angular",
            category: "web",
            length: 30,
            updated: "Jun 28, 2017"
        }
    ];

    private static creationSteps = [
        {
            title: "Informar Ano",
            content:
                "<p>Selecione o Ano/Série em que será aplicada este conteúdo.</p>"
        },
        {
            title: "Informar Disciplina",
            content: "<p>Informa a Disciplina que será avaliada</p>"
        },

        {
            title: "Adicionar Conteúdo",
            content:
                "<p>Adicione o conteúdo que você usará em sala de aula.</p>"
        },
        {
            title: "Adicionar Referências",
            content: "<p>Está usando conteúdo externo?</p>"
        },
        {
            title: "Adicionar Licença",
            content: "<p>Sob qual licença estará este conteúdo?</p>"
        },
        {
            title: "Adicionar Objetivo",
            content: "<p>Quais objetivos esse planejamento espera alcançar.</p>"
        },
        {
            title: "Relacionar Habilidades BNCC",
            content:
                "<p>Procure por referências de habilidades da Base Nacional Comum Curricular.</p>"
        },

        {
            title: "Quase lá",
            content: "<p>Agora é só salvar seu conteúdo!</p>"
        }
    ];

    private static editSteps = [
        {
            title: "Alterar Ano",
            content:
                "<p>Selecione o Ano/Série em que será aplicada este conteúdo.</p>"
        },
        {
            title: "Alterar Disciplina",
            content: "<p>Informa a Disciplina que será avaliada</p>"
        },

        {
            title: "Alterar Conteúdo",
            content:
                "<p>Adicione o conteúdo que você usará em sala de aula.</p>"
        },
        {
            title: "Alterar Referências",
            content: "<p>Está usando conteúdo externo?</p>"
        },
        {
            title: "Alterar Licença",
            content: "<p>Sob qual licença estará este conteúdo?</p>"
        },
        {
            title: "Alterar Objetivo",
            content:
                "<p>Adicione o conteúdo que você usará em sala de aula.</p>"
        },
        {
            title: "Alterar Habilidades da BNCC",
            content:
                "<p>Procure por referências de habilidades da Base Nacional Comum Curricular.</p>"
        },

        {
            title: "Quase lá",
            content: "<p>Agora é só salvar seu conteúdo!</p>"
        }
    ];

    private static viewSteps = [
        {
            title: "Informar Ano",
            content:
                "<p>Selecione o Ano/Série em que será aplicada este conteúdo.</p>"
        },
        {
            title: "Ver Comentários",
            content: "<p>Informa a Disciplina que será avaliada</p>"
        },

        {
            title: "Ver Histórico de Aplicação",
            content:
                "<p>Adicione o conteúdo que você usará em sala de aula.</p>"
        },
        {
            title: "Ver propostas de alteração",
            content:
                "<p>Adicione o conteúdo que você usará em sala de aula.</p>"
        }
    ];

    public static planning = [
        {
            id: "new",
            title: "Novo Planejamento",
            slug: "novo-plano",
            description:
                "Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "web",
            length: 30,
            totalSteps: PlanningFakeDb.creationSteps.length,
            updated: "Jun 28, 2017",
            steps: PlanningFakeDb.creationSteps
        },
        {
            id: "edit",
            title: "Editar Planejamento",
            slug: "editar-plano",
            description:
                "Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "web",
            length: 30,
            totalSteps: PlanningFakeDb.editSteps.length,
            updated: "Jun 28, 2017",
            steps: PlanningFakeDb.editSteps
        },
        {
            id: "view",
            title: "Ver Planejamento",
            slug: "ver-plano",
            description:
                "Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "web",
            length: 30,
            totalSteps: PlanningFakeDb.editSteps.length,
            updated: "Jun 28, 2017",
            steps: PlanningFakeDb.viewSteps
        }
    ];
}
