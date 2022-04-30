const models = require('../../../models');

module.exports = {
  async getAll(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getById(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getByOwner(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getBySchool(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getBySchoolSystem(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },
  async getVersions(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },
};
