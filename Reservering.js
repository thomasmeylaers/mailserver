const mongoose = require('mongoose')

const reserveringSchema = new mongoose.Schema({
  voornaam: String,
  achternaam: String,
  email: String,
  telefoon: String,
  bericht: String,
  datum: {
    type: Date,
    immutable: true,
    default: () => new Date()
  }
})

module.exports = mongoose.model("Reservering", reserveringSchema)
