/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const models = require('../models');

async function seedSpecific(name) {
  await new models.Discipline({
    name,
  }).save();
  await mongoose.disconnect();
}

async function seedCourses() {
  await new models.Course({
    name: 'Educação Infantil',
  }).save();

  await new models.Course({
    name: 'Ensino Fundamental 1º ao 5º Ano',
  }).save();
}

async function seedDefault() {
  const subject1 = await new models.Discipline({
    name: 'Formação Pessoal e Social',
  }).save();

  const subject2 = await new models.Discipline({
    name: 'Conhecimento de Mundo',
  }).save();

  const subject3 = await new models.Discipline({
    name: 'Educação Física',
  }).save();

  const subject10 = await new models.Discipline({
    name: 'Filosofia',
  }).save();

  const subject4 = await new models.Discipline({
    name: 'Artes',
  }).save();

  const subject5 = await new models.Discipline({
    name: 'História',
  }).save();

  const subject6 = await new models.Discipline({
    name: 'Geografia',
  }).save();

  const subject7 = await new models.Discipline({
    name: 'Português',
  }).save();

  const subject8 = await new models.Discipline({
    name: 'Matemática',
  }).save();

  const subject9 = await new models.Discipline({
    name: 'Ciências',
  }).save();

  // await new models.Course({
  //   saeCode: '0',
  //   name: 'Educação Infantil',
  //   disciplines: [subject1, subject2],
  // }).save();

  // await new models.Course({
  //   saeCode: '1',
  //   name: 'Ensino Fundamental 1º ao 5º Ano',
  //   disciplines: [subject3, subject4, subject5, subject6, subject7, subject8, subject9, subject10],
  // }).save();

  await mongoose.disconnect();
}

mongoose
  .connect('mongodb://localhost:27017/atlaensino', {
    useNewUrlParser: true,
  })
  .then(seedDefault);
