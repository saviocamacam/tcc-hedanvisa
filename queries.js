/*  Connect Database as Savio
mongo ds135540.mlab.com:35540/heroku_651d054x -u saviocam -p Mla@8456
mongodb://saviocam:Mla%408456@ds135540.mlab.com:35540/heroku_651d054x
docker exec -it atladb bash -c "mongo ds135540.mlab.com:35540/heroku_651d054x -u saviocam -p Mla@8456"


Connect Database as root
mongo ds135540.mlab.com:35540/heroku_651d054x -u heroku_651d054x -p svue5n5shgahu2tc2v3kheklea

Connect Database on EC2 as root (Optimus - Produção)
mongo ec2-54-166-130-125.compute-1.amazonaws.com:27017/admin -u saviocam -p Mla@8456
mongo ec2-54-166-130-125.compute-1.amazonaws.com -u saviocam -p Mla@8456 --authenticationDatabase admin
mongodb://saviocam:Mla%408456@ec2-54-166-130-125.compute-1.amazonaws.com/optimus
mongodump -h ec2-54-166-130-125.compute-1.amazonaws.com:27017 -d atlaensino -u saviocam -p Mla@8456 -o 2019_5_23
mongorestore -h ec2-54-166-130-125.compute-1.amazonaws.com:27017 -u saviocam -p Mla@8456 -d atlaensino 2019_3_5
docker exec -it atladb bash -c "mongo ec2-54-166-130-125.compute-1.amazonaws.com:27017/admin -u saviocam -p Mla@8456"

Connect Database on EC2 as root (Bumblebee - Dev)
mongo ec2-184-72-124-137.compute-1.amazonaws.com:27017/admin -u saviocam -p Mla@8456
mongo ec2-184-72-124-137.compute-1.amazonaws.com -u saviocam -p Mla@8456 --authenticationDatabase admin
mongodb://saviocam:Mla%408456@ec2-184-72-124-137.compute-1.amazonaws.com/bumblebee
mongodump -h ec2-184-72-124-137.compute-1.amazonaws.com:27017 -d atlaensino -u saviocam -p Mla@8456 -o 2019_5_23
mongorestore -h ec2-184-72-124-137.compute-1.amazonaws.com:27017 -u saviocam -p Mla@8456 -d atlaensino 2019_3_5
docker exec -it atladb bash -c "mongo ec2-184-72-124-137.compute-1.amazonaws.com:27017/admin -u saviocam -p Mla@8456"


Backup do Banco de Dados de Produção
mongodump -h ds135540.mlab.com:35540 -d heroku_651d054x -u saviocam -p Mla@8456 -o 2019_3_5

Backup do Banco de dados da Amazon (Jorge)

Restaurar banco de dados local com base na Produção
mongorestore -h localhost:27017 -d atlaensino 2019_3_5/heroku_651d054x


package.json
"server-mongo": "concurrently \"mongod --replSet rs0 --bind_ip localhost --port 27018\" \"nodemon app\"",

*/

// Encontrar Escola por Gestor de Escolar
db.profiles
  .find({ school_managers: { $in: [ObjectId('5c614e61b00e2200148bb6b8')] } })
  .pretty();

// Remover um Gestor Escolar pelo Link
db.profiles.update({ school_managers: { $in: [ObjectId('5c614e61b00e2200148bb6b8')] } }, { $pull: { school_managers: ObjectId('5c614e61b00e2200148bb6b8') } });

// Remover um Professor pelo Link
db.profiles.update({ professors: { $in: [ObjectId('5c65fdf677efdb00142c75ee')] } }, { $pull: { professors: ObjectId('5c66fe84ed4df200140c34f9') } });

// Mudar Estado de um Link
db.links.update({ requesting: ObjectId('5c66fe84ed4df200140c34f8') }, { $set: { status: 'accepted' } });

// Mudar todas as senhas
db.users.updateMany({}, { $set: { password: '' } });

// Mudar o endereço base de todas as fotos de perfil
db.profiles.updateMany(
  {},
  { $set: { avatar: 'assets/images/avatars/profile.jpg' } },
);

// Levar todos os nomes de usuário para LowerCase e Remover Espaços
// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
db.users.find().forEach((e) => {
  e.shortName = e.shortName.toLowerCase().replace(/\s+/g, '');
  db.users.save(e);
});

db.contacts.find().forEach((e) => {
  e.address = e.address.toLowerCase().replace(/\s+/g, '');
  db.contacts.save(e);
});

// Consulta para exclusãõ de turmas e matrículas de um ano escolar
db.schoolYearClassrooms.findById('', (doc) => {
  db.classrooms.find({ year: doc._id }).forEach((classroom) => {
    db.enrollments.delete({ classrooms: { $in: [classroom._id] } });
    db.schoolYearClassrooms.findByIdAndUpdate(doc._id, {
      $pull: { classrooms: classroom._id },
    });
  });
});

// Criar Ano Escolar na Escola
// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
db.profiles
  .find({
    profileType: 'ProfileSchoolInstitutional',
    countyInstitutional: ObjectId('5ba9517abde4ef0013e30eae'),
  })
  .forEach((school) => {
    print(`id: ${school._id}`);
    school.schoolYearClassrooms = new Array();
    try {
      const s1 = db.schoolyearclassrooms.insertOne({
        school: school._id,
        schoolYear: ObjectId('5c29d60a4fb02c0014f9564a'),
        classrooms: school.classrooms,
      });
      db.classrooms.update(
        { school: ObjectId(`${school._id}`) },
        { $set: { year: s1.insertedId } },
        { multi: true },
      );
      print(s1.insertedId);
      school.schoolYearClassrooms.push(s1.insertedId);
      delete school.classrooms;
    } catch (err) {
      print(err);
    }

    try {
      const s2 = db.schoolyearclassrooms.insertOne({
        school: school._id,
        schoolYear: ObjectId('5c29ef1d2d36cd001404d27f'),
      });
      print(s2.insertedId);
      school.schoolYearClassrooms.push(s2.insertedId);
    } catch (err) {
      print(err);
    }

    db.profiles.save(school);
  });

// Remover Anos Escolares nas Escolas
// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
db.profiles
  .find({
    profileType: 'ProfileSchoolInstitutional',
    countyInstitutional: ObjectId('5ba9517abde4ef0013e30eae'),
  })
  .forEach((school) => {
    print(`id: ${school._id}`);
    school.schoolYearClassrooms = new Array();
    db.profiles.save(school);
  });

// Atualizar 'year' de turmas
// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
db.profiles
  .find({
    profileType: 'ProfileSchoolInstitutional',
    countyInstitutional: ObjectId('5ba9517abde4ef0013e30eae'),
  })
  .forEach((school) => {
    print(`id: ${school._id}`);
    print(`sy: ${school.schoolYearClassrooms[0]}`);
    const sy = school.schoolYearClassrooms[0];
    db.classrooms.update(
      {
        school: { $eq: ObjectId(`${school._id}`) },
        year: { $eq: ObjectId('5c29d60a4fb02c0014f9564a') },
      },
      { $set: { year: ObjectId(`${sy}`) } },
      { multi: true },
    );
  });

// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
db.documents
  .find({ owner: ObjectId('5c518e54121b8b00148ff22d') })
  .forEach((document) => {
    db.documents.update(
      { _id: document._id },
      { $set: { owner: ObjectId('5c75db98f2f876001402de13') } },
    );
    db.profiles.findOneAndUpdate(
      { _id: ObjectId('5c518e54121b8b00148ff22d') },
      { $pull: { documents: document._id } },
    );
    db.profiles.findOneAndUpdate(
      { _id: ObjectId('5c75db98f2f876001402de13') },
      { $push: { documents: document._id } },
    );
  });

// rename enrollment fields
// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
db.enrollments.updateMany(
  {},
  {
    $rename: {
      'basic.CGM': 'basic.cgm',
      'basic.Nome do Aluno': 'basic.nome_do_aluno',
      'basic.Idade': 'basic.idade',
      'basic.Sexo': 'basic.sexo',
      'basic.Sit da Matrícula': 'basic.sit_da_matricula',
      'basic.Data Matric/Mov': 'basic.data_matricmov',
      'basic.Data Nascimento': 'basic.data_nascimento',

      'filiacao.Nome da Mãe': 'filiacao.nome_da_mae',
      'filiacao.RG/RNE da Mãe': 'filiacao.rgrne_da_mae',
      'filiacao.UF': 'filiacao.uf',
      'filiacao.Nome do Pai': 'filiacao.nome_do_pai',
      'filiacao.RG/RNE do Pai': 'filiacao.rgrne_do_pai',
      'filiacao.Nome do Responsável': 'filiacao.nome_do_responsavel',
      'filiacao.Parentesco do Responsável':
        'filiacao.parentesco_do_responsavel',
      'filiacao.CPF do Responsável': 'filiacao.cpf_do_responsavel',

      'contato.Celular Aluno': 'contato.celular_aluno',
      'contato.Celular Responsável': 'contato.celular_responsavel',
      'contato.Telefone Residencial': 'contato.telefone_residencial',
      'contato.Telefone Comercial': 'contato.telefone_comercial',
      'contato.Ramal': 'contato.ramal',
      'contato.Email aluno': 'contato.email_aluno',
      'contato.Email responsável': 'contato.email_responsavel',

      'endereco.CEP': 'endereco.cep',
      'endereco.UF': 'endereco.uf',
      'endereco.Cidade': 'endereco.cidade',
      'endereco.Endereço': 'endereco.endereco',
      'endereco.Número': 'endereco.numero',
      'endereco.Complemento': 'endereco.complemento',
      'endereco.Bairro': 'endereco.bairro',
      'endereco.Caixa Postal': 'endereco.caixa_postal',
      'endereco.Nº Inscrição Imobiliária': 'endereco.n_inscricao_imobiliaria',
      'endereco.Identificação Copel': 'endereco.identificacao_copel',
    },
  },
);

// aggregate para consulta com lookup de múltiplos campos
// Essa sintax com quebra de linha não funciona no CLI! Tem que ser em linha corrida!
[
  {
    $match: {
      shortName: 'danielfarina',
    },
  },
  {
    $unwind: {
      path: '$profiles',
    },
  },
  {
    $lookup: {
      from: 'profiles',
      localField: 'profiles',
      foreignField: '_id',
      as: 'profiles',
    },
  },
  {
    $unwind: {
      path: '$profiles',
    },
  },
  {
    $lookup: {
      from: 'links',
      let: {
        county: '$profiles._id',
        school: '$profiles._id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$requesting', '$$county'],
                },
                {
                  $eq: ['$requesting', '$$school'],
                },
              ],
            },
          },
        },
      ],
      as: 'result',
    },
  },
];

db.profiles.deleteMany({ profileType: 'ProfileCountyInstitutional', showType: 'Perfil Municipal Institucional', name: { $ne: 'CAMPO MOURAO' } });
db.profiles.updateMany({ profileType: 'ProfileSchoolInstitutional' }, { $set: { currentYear: ObjectId('5c29ef1d2d36cd001404d27f') } });
