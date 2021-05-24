import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { v4 as uuid } from "uuid";
import Admin from "App/Models/Admin";
import User from "App/Models/User";

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const email = 'admin@roomz.com'
    const phone_number = '9034138099';
    const country_code = '+91';
    const password = '1Zillion!';
    const admin = await Admin.firstOrCreate({ email: email, phone_number: phone_number, country_code: country_code })
    admin.email = email;
    admin.phone_number = phone_number;
    admin.country_code = country_code;
    admin.password = password;
    await admin.save();

    const uid = uuid()
    const user = await User.firstOrNew({ email: email });
    user.uid = uid;
    user.email = email;
    user.first_name = 'Admin';
    user.last_name = 'Roomz';
    user.password = password;
    user.username = email;
    await user.save()
  }
}
