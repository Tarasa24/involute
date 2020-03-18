const { ObjectId } = require('mongodb');
const yup = require('yup');

const yupLocaleCs = require('yup-locale-cs');
yup.setLocale(yupLocaleCs);

async function produkty(req, res, db) {
  var result = await db
    .collection('eshop-produkty')
    .find({})
    .toArray();

  res.json(result);
}

async function produkt(req, res, db) {
  try {
    let result = await db
      .collection('eshop-produkty')
      .find({ _id: ObjectId(req.params.id) })
      .project()
      .next();

    if (result === null) throw 400;

    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

function objednat(req, res, db) {
  let schema = yup.object().shape({
    timestamp: yup.number().default(function() {
      return Math.floor(Date.now() / 1000);
    }),
    basket: yup
      .array()
      .of(
        yup.object().shape({
          _id: yup
            .string()
            .required()
            .length(24),
          name: yup
            .string()
            .required()
            .max(254),
          price: yup.number().required(),
          amount: yup
            .number()
            .required()
            .min(1),
        })
      )
      .required()
      .min(1),
    adress: yup
      .object()
      .required()
      .shape({
        Jmeno: yup
          .string()
          .required()
          .max(35),
        Příjmení: yup
          .string()
          .required()
          .max(35),
        Ulice: yup
          .string()
          .required()
          .max(90),
        Město: yup
          .string()
          .required()
          .max(45),
        PSČ: yup
          .string()
          .required()
          .max(11),
        Email: yup
          .string()
          .required()
          .email()
          .min(3)
          .max(254),
        Phone: yup
          .string()
          .required()
          .max(20),
        Fakturační: yup
          .object()
          .shape({
            'Jméno a příjmení nebo Firma': yup
              .string()
              .required()
              .max(120),
            'Ulice a číslo popisné': yup
              .string()
              .required()
              .max(120),
            Město: yup
              .string()
              .required()
              .max(45),
            PSČ: yup
              .string()
              .required()
              .max(11),
            IČ: yup
              .string()
              .required()
              .max(20),
            DIČ: yup
              .string()
              .required()
              .max(20),
          })
          .strip(req.body.adress.Fakturační === undefined),
      }),
    delivery: yup
      .object()
      .required()
      .shape({
        delivery: yup
          .string()
          .required()
          .max(50),
        payment: yup
          .string()
          .required()
          .max(50),
      }),
    coupon: yup.string().max(100),
    totalPrice: yup.number().required(),
  });

  schema
    .validate(req.body, { strict: true })
    .then(data => {
      db.collection('eshop-objednavky').insertOne(
        schema.noUnknown().cast(data)
      );
      res.sendStatus(202);
    })
    .catch(err => {
      res.status(400);
      res.json(err.errors);
    });
}

module.exports = { produkty, produkt, objednat };