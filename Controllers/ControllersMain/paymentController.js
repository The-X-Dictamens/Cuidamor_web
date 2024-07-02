const paypalPayouts = require('@paypal/payouts-sdk');
const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const { DOUBLE } = require('sequelize');
const query = promisify(conexionU.query).bind(conexionU);


const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

let environment = new paypalPayouts.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypalPayouts.core.PayPalHttpClient(environment);

async function pagarEmpleado(email, amount) {
  let requestBody = {
    sender_batch_header: {
      sender_batch_id: `Payouts_${Math.random()}`,
      email_subject: "You have a payout!",
      email_message: "You have received a payout! Thanks for using our service!"
    },
    items: [{
      recipient_type: "EMAIL",
      amount: {
        value: amount,
        currency: "MXN"
      },
      receiver: email,
      note: "Thank you for your service!",
      sender_item_id: `item_${Math.random()}`
    }]
  };

  let request = new paypalPayouts.payouts.PayoutsPostRequest();
  request.requestBody(requestBody);

  try {
    let response = await client.execute(request);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

exports.AuthpagarEmpleado = async (req, res) => {
  const { email, amount, password } = req.body;

  const id_datacc = req.userData.id_datacc;

  //sacamos cuantos creditos tiene el usuario y su contraseña
  const passw = await query('SELECT pas_datacc FROM datos_acceso WHERE id_datacc = ?', [id_datacc]);
  const creditos = await query('SELECT cred_emp FROM empleado WHERE id_datacc = ?', [id_datacc]);

  let amount2 = parseFloat(amount);
  let creditos2 = parseFloat(creditos[0].cred_emp);
  let validpass = bcryptjs.compareSync(password, passw[0].pas_datacc);

  console.log(validpass, passw[0].pas_datacc, password);


  if (!email || !amount || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
  }

  if(validpass){
    if (creditos2 < amount2) {
      return res.status(400).json({ success: false, message: 'No tienes suficientes créditos para realizar la transferencia.' });
    }else{
      // Aquí puedes agregar la lógica para verificar la contraseña del usuario
      try {
        const response = await pagarEmpleado(email, amount);
        if (response.statusCode === 201) {
          res.status(200).json({ success: true, message: 'Transferencia realizada con éxito.', details: response.result });
        } else {
          res.status(500).json({ success: false, message: 'Error al realizar la transferencia.', details: response });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno del servidor.', details: error });
      }
    }
  }else{
    return res.status(400).json({ success: false, message: 'Contraseña incorrecta.' });
  }
}