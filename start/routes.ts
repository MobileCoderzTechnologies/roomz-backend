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
  Route.post('check-account', 'AuthController.checkAccount');

  Route.post('resend-otp', 'AuthController.reSendOtp');

  Route.post('verify-otp', 'AuthController.verifyOtp');

  Route.post('register', 'AuthController.register');

  Route.post('login', 'AuthController.login');

  Route.post('social-login', 'AuthController.socialLogin');


}).prefix("auth").middleware('locale');


Route.group(() => {
  Route.get('bed-types', 'User/HostingController.getBedTypes');

  Route.get('property-types', 'User/HostingController.getPropertyTypes');

  Route.get('amenities', 'User/HostingController.getAmenities');

  Route.get('home-details', 'User/HostingController.getHomeDetails');

  Route.get('home-rules', 'User/HostingController.getHomeRule');

  Route.post('list-property/type', 'User/PropertyController.addPropertyType');

  Route.put('list-property/beds/:id', 'User/PropertyController.addBeds');

  Route.put('list-property/address/:id', 'User/PropertyController.addPropertyAddress');

  Route.put('list-property/location/:id', 'User/PropertyController.addPropertyLocation');

  Route.put('list-property/amenities/:id', 'User/PropertyController.addPropertyAmenities');

  Route.put('list-property/guest-requirements/:id', 'User/PropertyController.addPropertyGuestRequirements');

  Route.put('list-property/house-rules/:id', 'User/PropertyController.setPropertyHomeRules');

  Route.put('list-property/property-details/:id', 'User/PropertyController.addPropertyDetails');

  Route.put('list-property/description/:id', 'User/PropertyController.addPropertyDescription');

  Route.put('list-property/name/:id', 'User/PropertyController.addPropertyName');

}).prefix('user/hosting').middleware(['locale', 'auth', 'userStatus']);


/************************ Admin Controller ************************/
Route.group(() => {
  Route.post('login', 'AdminController.login');
}).prefix("admin").middleware('locale');

/******************* Admin Controller Authorized ******************/
Route.group(() => {
  Route.post('change-password', 'AdminController.changePassword');
  Route.get('users', 'Admin/UserController.getUsersList');
  Route.delete('delete-user/:userId', 'Admin/UserController.deleteUser');
  Route.put('toggle-status/:userId', 'Admin/UserController.toggleStatus');

  Route.get('users-list', 'AdminController.getUsersList');
}).prefix("admin").middleware(['locale', 'auth']);
