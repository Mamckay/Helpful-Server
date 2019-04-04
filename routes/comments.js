'use strict';
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Comment = require('../models/comments');

const router = express.Router();

/* JWT Auth */
const jwtAuth = passport.authenticate('jwt', { session: false });

/* Get all  */
router.get('/', (req, res, next) => {
  Comment.find()
    .sort({ createdAt: 'desc' })
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      next(err);
    });
});

/* Get all comments for an event */
router.get('/event/:eventId', jwtAuth, (req, res, next) => {
  const { eventId } = req.params;
  Comment.find({ eventId })
    .sort({ createdAt: 'desc' })
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      next(err);
    });
});

// /* Get a specific comment via userid and organization id  */
// router.get('/user', jwtAuth, (req, res, next) => {
//   const orgId = req.body;
//   const userId = req.user.id;
//   Comment.find({ userId, organizationId: orgId })
//     .sort({ createdAt: 'desc' })
//     .then(comments => {
//       res.json(comments);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

/* Get all comments from a user */
router.get('/user/all', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  Comment.find({ userId })
    .sort({ createdAt: 'desc' })
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      next(err);
    });
});

/* Post New Comment Endpoint  */
router.post('/', jwtAuth, (req, res, next) => {
  const { eventId, comment } = req.body;
  const userId = req.user.id;

  /* Validation */
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `userId` is not valid');
    err.status = 400;
    return next(err);
  }
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    const err = new Error('The `eventId` is not valid');
    err.status = 400;
    return next(err);
  }
  if (!comment) {
    const err = new Error('The `comment` is not valid');
    err.status = 400;
    return next(err);
  }

  /*            */

  const newComment = { userId, comment, eventId };
  Comment.create(newComment)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/', jwtAuth, (req, res, next) => {
  let { comment, orgId } = req.body;
  const userId = req.user.id;
  let Comment = {};
  /* Validation */
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `userid` is not valid');
    err.status = 400;
    return next(err);
  }
  if (!mongoose.Types.ObjectId.isValid(orgId)) {
    const err = new Error('The `orgid` is not valid');
    err.status = 400;
    return next(err);
  }
  if (comment) {
    if (typeof comment !== String) {
      const err = new Error('The `comment` is not valid');
      err.status = 400;
      return next(err);
    } else {
      Comment.rating = comment;
    }
  }
  //   if (description) {
  //     if (typeof description !== String) {
  //       const err = new Error('The `description` is not valid');
  //       err.status = 400;
  //       return next(err);
  //     } else {
  //       Comment.description = description;
  //     }
  //   }
  /*            */

  Comment.findOneAndUpdate({ userId, organizationId: orgId }, { Comment })
    .sort({ createdAt: 'desc' })
    .then(event => {
      res.json(event);
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/', jwtAuth, (req, res, next) => {
  const { orgId } = req.body;
  const userId = req.user.id;
  Comment.findOneAndDelete({ userId, orgId })
    .then(rating => {
      res.json(rating);
    })
    .catch(err => {
      next(err);
    });
});



router.get('/tester', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
});


module.exports = router;
