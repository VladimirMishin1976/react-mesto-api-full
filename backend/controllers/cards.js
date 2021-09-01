const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const AccessError = require('../errors/access-error');
const ServerError = require('../errors/server-err');

module.exports = {
  getCards(req, res, next) {
    Card.find({})
      .then((cards) => res.send({ data: cards }))
      .catch(next);
  },

  createCard(req, res, next) {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
      .then((card) => res.status(201).send({ data: card }))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          throw new ValidationError(error.message);
        } else {
          throw new ServerError('На сервере произошла ошибка');
        }
      })
      .catch(next);
  },

  deleteCard(req, res, next) {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }
        if (String(card.owner) !== req.user._id) {
          throw new AccessError('Попытка удалить чужую карточку');
        }

        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(200).send(card))
          .catch(next);
      })
      .catch(next);
  },

  likeCard(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }
        return res.status(200).send(card);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new ValidationError('Переданы некоректные данные'));
        } else {
          next(err);
        }
      });
  },

  dislikeCard(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }
        return res.send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new ValidationError('Переданы некоректные данные'));
        } else {
          next(err);
        }
      });
  },
};
