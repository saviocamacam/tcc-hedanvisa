import { FuseNavigation } from "@fuse/types";

export const navigationSchool: FuseNavigation[] = [
    {
        id: "applications",
        title: "APLICAÇÕES",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "authorization",
                title: "AUTORIZAÇÕES",
                type: "item",
                icon: "lock",
                url: "/autorizacoes"
            },
            {
                id: "classrooms",
                title: "TURMAS",
                type: "item",
                icon: "class",
                url: "/turmas"
            },
            {
                id: "frequency",
                title: "FREQUÊNCIAS",
                type: "item",
                icon: "list_alt",
                url: "/frequencias"
            },
            {
                id: "plannings",
                title: "PLANEJAMENTOS",
                type: "collapsable",
                icon: "format_align_left",
                children: [
                    {
                        id: "BNCC",
                        title: "BNCC",
                        type: "item",
                        url: "/planejamentos/bncc"
                    },
                    {
                        id: "annualPlanning",
                        title: "ANUAL",
                        type: "item",
                        url: "/planejamentos/anual"
                    }
                    // {
                    //     id: "PTD",
                    //     title: "PTD",
                    //     type: "item",
                    //     url: "/escola/planejamento/ptd"
                    // }
                ]
            },
            {
                id: "exam-1",
                title: "BANCO DE QUESTÕES",
                type: "item",
                icon: "list_alt",
                url: "/escola/banco-questoes"
            },
            {
                id: "plannings",
                title: "BANCO DE AULAS",
                type: "item",
                icon: "list_alt",
                url: "/escola/banco-planejamentos"
            }
        ]
    }
];
