const models = require('../../models');

async function updateDate(req, res) {
  try {
    const { start } = req.body;
    console.log(req.body);
    const { id } = req.params;
    console.log(req.params);

    // const { requesting } = req.headers;

    const event = await models.Event.findByIdAndUpdate(id, { $set: { start } }, { new: true });
    console.log(event);
    if (!event) throw new Error('NOT_FOUND');

    return res.status(201).json({
      message: 'SUCCESS',
      data: event,
    });
  } catch (error) {
    console.log(error);
    if (error.message === 'NOT_FOUND') {
      res.status(404).json({
        message: 'EVENT_NOT_FOUND',
        data: null,
      });
    }
    return res.status(400).json({ success: false, message: 'ERROR', data: error });
  }
}

module.exports = { updateDate };
