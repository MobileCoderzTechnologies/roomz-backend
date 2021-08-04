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

  Route.get('my-profile', 'User/UsersController.getMyProfile');

  Route.post('profile-photo', 'User/UsersController.updateProfilePhoto');

  Route.put('phone-number', 'User/UsersController.updatePhoneNumber');

}).prefix('user').middleware(['locale', 'auth', 'userStatus'])


Route.group(() => {
  Route.get('bed-types', 'User/HostingController.getBedTypes');

  Route.get('property-types', 'User/HostingController.getPropertyTypes');

  Route.get('amenities', 'User/HostingController.getAmenities');

  Route.get('home-details', 'User/HostingController.getHomeDetails');

  Route.get('home-rules', 'User/HostingController.getHomeRule');

  Route.post('upload-images','User/HostingController.uploadImage');

  Route.post('remove-images','User/HostingController.deleteImages');

  // property controller

  Route.group(() => {
    Route.post('type/:id?', 'User/PropertyController.addPropertyType');

    Route.put('beds/:id', 'User/PropertyController.addBeds');

    Route.put('address/:id', 'User/PropertyController.addPropertyAddress');

    Route.put('location/:id', 'User/PropertyController.addPropertyLocation');

    Route.put('amenities/:id', 'User/PropertyController.addPropertyAmenities');

    Route.put('guest-requirements/:id', 'User/PropertyController.addPropertyGuestRequirements');

    Route.put('house-rules/:id', 'User/PropertyController.setPropertyHomeRules');

    Route.put('property-details/:id', 'User/PropertyController.addPropertyDetails');

    Route.put('description/:id', 'User/PropertyController.addPropertyDescription');

    Route.put('name/:id', 'User/PropertyController.addPropertyName');

    Route.put('availability/:id', 'User/PropertyController.setPropertyAvailability');

    Route.put('phone-number/:id', 'User/PropertyController.addSecPhoneNumber');

    Route.put('pricing/:id', 'User/PropertyController.setPropertyPricing');

    Route.put('laws-and-calender/:id', 'User/PropertyController.lawsAndCalender');

    Route.put('questions/:id', 'User/PropertyController.PropertyQuestions');

    Route.put('discounts/:id', 'User/PropertyController.longTermDiscounts');

    Route.get('preview/:id', 'User/PropertyController.propertyPreview');

    Route.put('photos/:id', 'User/PropertyController.addPropertyPhotos');

    Route.get('publish/:id', 'User/PropertyController.publishProperty');

  }).prefix('list-property');

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
