import { FuseNavigation } from "@fuse/types";

export const navigationStudent: FuseNavigation[] = [
    {
        id: "applications",
        title: "APLICAÇÕES",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "assestments",
                title: "AVALIAÇÕES",
                type: "collapsable",
                icon: "library_books",
                children: [
                    {
                        id: "overview",
                        title: "VISÃO GERAL",
                        type: "item",
                        url: "/aluno/avaliacoes/visaogeral"
                    },
                    {
                        id: "feedback",
                        title: "FEEDBACK",
                        type: "item",
                        url: "/aluno/avaliacoes/feedback"
                    }
                ]
            },
            {
                id: "tasks",
                title: "TAREFAS",
                type: "item",
                icon: "check_box",
                url: "/aluno/tarefa"
            },
            {
                id: "tasks",
                title: "EVENTOS",
                type: "item",
                icon: "insert_invitation",
                url: "/aluno/eventos"
            },
            {
                id: "tasks",
                title: "BOLETIM",
                type: "item",
                icon: "email",
                url: "/aluno/boletim"
            }
        ]
    }
];
