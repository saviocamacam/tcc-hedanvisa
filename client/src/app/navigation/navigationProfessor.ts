import { FuseNavigation } from "@fuse/types";

export const navigationProfessor: FuseNavigation[] = [
    {
        id: "applications",
        title: "APLICAÇÕES",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
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
                icon: "list_alt",
                children: [
                    {
                        id: "bncc",
                        title: "BNCC",
                        type: "item",
                        url: "/planejamentos/bncc"
                    },
                    {
                        id: "plannings",
                        title: "PLANEJAMENTO DIÁRIO",
                        type: "item",
                        url: "/professor/banco-planejamentos"
                    },

                    {
                        id: "anual",
                        title: "ANUAL",
                        type: "item",
                        url: "/planejamentos/anual"
                    }
                    // {
                    //     id: "ptd",
                    //     title: "PTD",
                    //     type: "item",
                    //     url: "/professor/planejamento/ptd"
                    // },
                ]
            }
            // {
            //     id: "exam-1",
            //     title: "BANCO DE QUESTÕES",
            //     type: "item",
            //     icon: "list_alt",
            //     url: "/professor/banco-questoes"
            // },
            // {
            //     id: "plannings",
            //     title: "BANCO DE AULAS",
            //     type: "item",
            //     icon: "list_alt",
            //     url: "/professor/banco-planejamentos"
            // }
        ]
    }
];
