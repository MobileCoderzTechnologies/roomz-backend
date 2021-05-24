/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

/************************ Auth Controller ************************/
Route.group(() => {
  Route.post('check_account', 'AuthController.checkAccount');

  Route.post('resend_otp', 'AuthController.reSendOtp');

  Route.post('verify_otp', 'AuthController.verifyOtp');

  Route.post('register', 'AuthController.register');

  Route.post('login', 'AuthController.login');
}).prefix("auth").middleware('locale');


/************************ Admin Controller ************************/
Route.group(() => {
  Route.post('login', 'AdminController.login');
}).prefix("admin").middleware('locale');

Route.group(() => {
  Route.post('change_password', 'AdminController.changePassword');
}).prefix("admin").middleware(['locale', 'auth']);