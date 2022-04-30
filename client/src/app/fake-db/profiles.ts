const profileTypes = [
    {
        value: "student",
        viewValue: "Aluno",
        availability: "waiting"
    },
    {
        value: "parent",
        viewValue: "Família",
        availability: "waiting"
    },
    {
        value: "professor",
        viewValue: "Professor",
        availability: "done"
    },
    {
        value: "school",
        viewValue: "Gestão Escolar",
        availability: "done"
    },
    {
        value: "county",
        viewValue: "Rede de Ensino",
        availability: "waiting"
    },
    {
        value: "comunity",
        viewValue: "Comunidade",
        availability: "waiting"
    }
];

const courseLevels = [
    {
        value: "special",
        viewValue: "Educação Especial",
        availability: "waiting"
    },
    {
        value: "infantil",
        viewValue: "Educação Infantil",
        availability: "waiting"
    },
    {
        value: "f1",
        viewValue: "Ensino Fundamental 1",
        availability: "done"
    },
    {
        value: "f2",
        viewValue: "Ensino Fundamental 2",
        availability: "waiting"
    },
    {
        value: "medio",
        viewValue: "Ensino Médio",
        availability: "waiting"
    },
    {
        value: "mediot",
        viewValue: "Ensino Médio Técnico",
        availability: "waiting"
    },
    {
        value: "superior",
        viewValue: "Ensino Superior",
        availability: "waiting"
    },
    {
        value: "eja",
        viewValue: "EJA",
        availability: "waiting"
    }
];

const countyRoles = [
    {
        value: "pedChief",
        viewValue: "Chefe Pedagógico"
    },
    {
        value: "admChief",
        viewValue: "Chefe Administrativo"
    }
];

const schoolRoles = [
    {
        value: "director",
        viewValue: "Diretor",
        availability: "done"
    },
    {
        value: "subdirector",
        viewValue: "Vice-diretor",
        availability: "done"
    },
    {
        value: "pedAdvisor",
        viewValue: "Orientador Pedagógico",
        availability: "done"
    },
    {
        value: "scribe",
        viewValue: "Escriturário",
        availability: "done"
    }
    // {
    //   value: "librarian",
    //   viewValue: "Bibliotecário",
    //   availability: "waiting"
    // }
];

const kinships = [
    {
        value: "father",
        viewValue: "Pai"
    },
    {
        value: "mother",
        viewValue: "Mãe"
    },
    {
        value: "stepfather",
        viewValue: "Padastro"
    },
    {
        value: "stepmother",
        viewValue: "Madastra"
    },
    {
        value: "grandmo",
        viewValue: "Avó"
    },
    {
        value: "grandpa",
        viewValue: "Avô"
    },
    {
        value: "uncle",
        viewValue: "Tio"
    },
    {
        value: "aunt",
        viewValue: "Tia"
    }
];

const voluntaries = [
    {
        value: "dentist",
        viewValue: "Dentista"
    },
    {
        value: "programmer",
        viewValue: "Programador"
    },
    {
        value: "ittechnician",
        viewValue: "Técnico de TI"
    },
    {
        value: "psychologist",
        viewValue: "Psicólogo"
    },
    {
        value: "trainee_teacher",
        viewValue: "Professor Estagiário"
    }
];
const courseYearsChild = [
    {
        value: "i1",
        viewValue: "Infantil 1"
    },
    {
        value: "i2",
        viewValue: "Infantil 2"
    },
    {
        value: "i3",
        viewValue: "Infantil 3"
    },
    {
        value: "i4",
        viewValue: "Infantil 4"
    },
    {
        value: "i5",
        viewValue: "Infantil 5"
    }
];

const courseYears = [
    {
        value: "1",
        viewValue: "1º"
    },
    {
        value: "2",
        viewValue: "2º"
    },
    {
        value: "3",
        viewValue: "3º"
    },
    {
        value: "4",
        viewValue: "4º"
    },
    {
        value: "5",
        viewValue: "5º"
    },
    {
        value: "6",
        viewValue: "6º"
    },
    {
        value: "7",
        viewValue: "7º"
    },
    {
        value: "8",
        viewValue: "8º"
    },
    {
        value: "9",
        viewValue: "9º"
    }
];

const foundExamples = [
    {
        name: "savio",
        photo: "assets/imgs/placeholder.png",
        contact: "savio@savio.com",
        id: "43683863263"
    },
    {
        name: "jefferson",
        photo: "assets/imgs/placeholder.png",
        contact: "jeffmant@jeffmant.com",
        id: "43690089803"
    },
    {
        name: "mercia",
        photo: "assets/imgs/placeholder.png",
        contact: "998509513",
        id: "09990897963"
    },
    {
        name: "barbara",
        photo: "assets/imgs/placeholder.png",
        contact: "barbara@barbara.com",
        id: "76656463"
    },
    {
        name: "celma",
        photo: "assets/imgs/placeholder.png",
        contact: "988173851",
        id: "43689808978"
    }
];

const periods = [
    {
        value: "bi",
        showValue: "Bimestral",
        showListValue: "Bimestre",
        periods: 4
    },
    {
        value: "tri",
        showValue: "Trimestral",
        showListValue: "Trimestre",
        periods: 3
    },
    {
        value: "sem",
        showValue: "Semestral",
        showListValue: "Semestre",
        periods: 2
    }
];

export default {
    courseLevels,
    countyRoles,
    profileTypes,
    schoolRoles,
    kinships,
    voluntaries,
    courseYears,
    foundExamples,
    periods,
    courseYearsChild
};
