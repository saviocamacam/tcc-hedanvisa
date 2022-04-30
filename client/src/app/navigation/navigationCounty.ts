import { FuseNavigation } from "@fuse/types";

export const navigationCounty: FuseNavigation[] = [
    {
        id: "applications",
        title: "APLICAÇÕES",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "university",
                title: "ESCOLAS",
                type: "item",
                icon: "account_balance",
                url: "/escola"
            },

            {
                id: "plannings",
                title: "PLANEJAMENTOS",
                type: "collapsable",
                icon: "format_align_left",
                children: [
                    {
                        id: "bncc",
                        title: "BNCC",
                        type: "item",
                        url: "/planejamentos/bncc"
                    },
                    {
                        id: "anual-planning",
                        title: "ANUAL",
                        type: "item",
                        url: "/planejamentos/anual"
                    }
                ]
            },

            {
                id: "authorization",
                title: "AUTORIZAÇÃO",
                type: "item",
                icon: "lock",
                url: "/autorizacoes"
            },
            {
                id: "exam-1",
                title: "BANCO DE QUESTÕES",
                type: "item",
                icon: "list_alt",
                url: "/rede/banco-questoes"
            },
            {
                id: "plannings",
                title: "BANCO DE AULAS",
                type: "item",
                icon: "list_alt",
                url: "/rede/banco-planejamentos"
            }
        ]
    }
];
