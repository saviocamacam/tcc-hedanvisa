export class TaskFakeDb {
    private static demoSteps = [
        {
            title: "Definição",
            content:
                "<h1>Passo 1 - Definição</h1>" +
                "<br>" +
                "<h4>A aritmética é o ramo da matemática que lida com números e com as operações possíveis entre eles. " +
                "<br><br>" +
                "É o ramo mais antigo e mais elementar da matemática, usado por quase todos, seja em tarefas do cotidiano, em cálculos científicos ou de negócios." +
                "<br><br>" +
                "As operações aritméticas tradicionais são: </h4>" +
                "<ul>" +
                "<li>" +
                "Adição;" +
                "</li>" +
                "<li>" +
                "Subtração;" +
                "</li>" +
                "<li>" +
                "Multiplicação;" +
                "</li>" +
                "<li>" +
                "Divisão;" +
                "</li>" +
                "</ul>"
        },
        {
            title: "Adição",
            content:
                "<h1>Passo 2 - Adição</h1>" +
                "<br>" +
                "<h4>Adição é uma das operações básicas da aritmética. Na sua forma mais simples, a adição combina dois números em um único número, denominado soma, total ou resultado.</h4>" +
                "<br><br>" +
                "<div align='center'><img src='assets/images/courses/math/parcelas.png' align='bottom'></img></div>"
        },
        {
            title: "Subtração",
            content:
                "<h1>Passo 3 - Subtração</h1>" +
                "<br>" +
                "<h4>A subtração é uma técnica que pode ser usada para diminuir números a fim de obter sua diferença. Em outras palavras, é uma técnica para subtrair.</h4>" +
                "<br><br>"
        },
        {
            title: "Multiplicação",
            content:
                "<h1>Passo 4 - Multiplicação</h1>" +
                "<br>" +
                "<h4>Ela é uma evolução natural da adição, pois é definida de modo que represente a soma de determinado número de conjuntos que possuem a mesma quantidade de elementos." +
                "<div align='center'><h5>2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 = 16</h5></div>" +
                "Essa soma pode ser representada pelo símbolo “x” ou “·”. No exemplo anterior:</h4>" +
                "<div align='center'><h5> 2x8 = 16</h5></div>"
        },
        {
            title: "Divisão",
            content:
                "<h1>Passo 5 - Divisão</h1>" +
                "<br>" +
                "A divisão é o ato de dividir em partes iguais para todos." +
                " O número que está sendo dividido em partes iguais é chamado de dividendo. " +
                "O número que indica em quantas vezes vamos dividir é chamado de divisor. " +
                "O resultado é chamado de quociente." +
                "O que sobra é chamado de resto." +
                "<div align='center'><h5> 15 ÷ 2 = 7 (sobra 1, portanto tem-se resto 1)</h5></div>"
        },
        {
            title: "Fim!",
            content:
                "<h1>Passo 6 - Fim!</h1>" +
                "<br>" +
                "Parabéns!! Você acaba de aprender o básico sobre operações aritméticas."
        }
    ];

    public static tasks = [
        {
            id: "15459251a6d6b397565",
            title: "Operações Aritméticas",
            slug: "operacoes-aritmeticas",
            description:
                "As operações aritméticas tradicionais são a adição, a subtração, a multiplicação e a divisão.",
            subject: "matematica",
            length: 30,
            totalSteps: 6,
            deadline: "23/07/2018",
            steps: TaskFakeDb.demoSteps
        },
        {
            id: "154588a0864d2881124",
            title: "A água",
            slug: "agua",
            description:
                "A água é a substância mais abundante do planeta. Ela é encontrada nos oceanos, no gelo, em rios, lagos, chuvas, no ar que respiramos, no solo e abaixo dele (nos lençóis freáticos).",
            subject: "ciencias",
            length: 60,
            totalSteps: 6,
            deadline: "24/07/2018",
            steps: TaskFakeDb.demoSteps
        }
    ];

    public static subjects = [
        {
            id: 0,
            value: "portugues",
            label: "Língua Portuguesa"
        },
        {
            id: 1,
            value: "matematica",
            label: "Matemática"
        },
        {
            id: 2,
            value: "ciencias",
            label: "Ciências"
        }
    ];

    public static users = [
        {
            id: "5725a6802d10e277a0f35724",
            name: "Jefferson Mantovani",
            avatar: "assets/images/avatars/andrew.jpg",
            subjects: ["web", "firebase"],
        }
    ];
}
