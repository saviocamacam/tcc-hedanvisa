export class QuestionFakeDb {
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
                "<p>Selecione o Ano/Série que será aplicada esta questão.</p>"
        },
        {
            title: "Informar Disciplina",
            content: "<p>Informe a disciplina que será avaliada.</p>"
        },
        {
            title: "Adicionar Enunciado",
            content:
                "<p>Crie o somente corpo da questão. Não adicione respostas!</p>"
        },
        {
            title: "Relacionar Habilidades da BNCC (opcional)",
            content:
                "<p>Procure por referências de habilidades da Base Nacional Comum Curricular (opcional).</p>"
        },
        {
            title: "Relacionar Descritores Avaliativos",
            content:
                "<p>Procure por descritores avaliativos da Prova Brasil e da ANA.</p>"
        },
        {
            title: "Adicionar respostas",
            content: "<p>Adicione as respostas e marque a opção correta.</p>"
        },
        {
            title: "Adicionar Objetivos da Questão",
            content:
                "<p>Informe o que espera avaliar ou colher de resultado.</p>"
        },
        {
            title: "Pronto",
            content: "<p>Agora é só salvar sua questão.</p>"
        }
    ];

    private static editSteps = [
        {
            title: "Alterar Ano",
            content: "<p>Troque o Ano/Série que será aplicada esta questão.</p>"
        },
        {
            title: "Alterar Disciplina",
            content: "<p>Informe a disciplina que será avaliada.</p>"
        },
        {
            title: "Revisar o Enunciado",
            content:
                "<p>Verifique o que pode ser modificado no corpo da questão. Não adicione respostas!</p>"
        },
        {
            title: "Revisar as Habilidades da BNCC já marcadas",
            content:
                "<p>Procure por referências de habilidades da Base Nacional Comum Curricular.</p>"
        },
        {
            title: "Revisar Descritores Avaliativos",
            content:
                "<p>Procure por descritores avaliativos da Prova Brasil e da ANA.</p>"
        },
        {
            title: "Modificar respostas",
            content: "<p>Resive as respostas e a opção correta.</p>"
        },
        {
            title: "Modificar Objetivos da Questão",
            content:
                "<p>Informe o que espera avaliar ou colher de resultado.</p>"
        },
        {
            title: "Atualizar",
            content: "<p>Atualizar permissões da nova versão da questão.</p>"
        }
    ];

    public static question = [
        {
            id: "new",
            title: "Nova questão",
            slug: "nova-questao",
            description:
                "Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "web",
            length: 30,
            totalSteps: QuestionFakeDb.creationSteps.length,
            updated: "Jun 28, 2017",
            steps: QuestionFakeDb.creationSteps
        },
        {
            id: "edit",
            title: "Editar questão",
            slug: "editar-questao",
            description:
                "Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "web",
            length: 30,
            totalSteps: QuestionFakeDb.editSteps.length,
            updated: "Jun 28, 2017",
            steps: QuestionFakeDb.editSteps
        },
        {
            id: "view",
            title: "Nova questão",
            slug: "ver-questao",
            description:
                "Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "web",
            length: 30,
            totalSteps: QuestionFakeDb.editSteps.length,
            updated: "Jun 28, 2017",
            steps: QuestionFakeDb.editSteps
        }
    ];
}
