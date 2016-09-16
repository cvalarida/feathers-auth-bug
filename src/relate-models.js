/**
 * This is workaround for relating models.
 * I don't know why it works, but it does.
 *
 * @param app  The initialized app
 */
module.exports = function(app) {
  const sequelize = app.get('sequelize');

  // console.log('Relating models:');

  // Copied this from src/models/index.js
  Object.keys(sequelize.models).forEach(modelName => {
    if ('associate' in sequelize.models[modelName]) {
      // console.log(`  ${modelName} (true)`);
      sequelize.models[modelName].associate();
    }
    // else
    //   console.log(`  ${modelName} (false)`);
  });
}
