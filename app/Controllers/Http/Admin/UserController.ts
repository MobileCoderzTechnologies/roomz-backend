import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Response from "App/Helpers/Response";
// import Admin from "App/Models/Admin";
import User from "App/Models/User";
// Transaltion
import i18n from 'App/Helpers/i18n';
import { ApiFeatures } from 'App/Utils/apiFeatures';
// import Database from '@ioc:Adonis/Lucid/Database';
const t = i18n.__;
export default class UsersController {

  async getUsersList({ request, response }: HttpContextContract) {
    try {

      const queryString = request.qs();
      const usersQuery = User.query().where('is_deleted', 0);
      const apiFeatures = new ApiFeatures(usersQuery, queryString)
        .filtering()
        .searching(['first_name', 'last_name', 'email'])
        .sorting('created_at')
        .pagination();

      const users = await apiFeatures.query;

      return response.status(Response.HTTP_OK).json({
        users
      });

    } catch (e) {
      console.log(e)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Something went wrong')
      });
    }
  }
  async deleteUser({ response, params }: HttpContextContract) {
    try {
      const userId = params.userId;
      const user = await User.query()
        .where('uid', userId)
        .first();

      if (user) {
        user.is_deleted = true;
        await user.save();
      } else {
        return response.status(Response.HTTP_BAD_REQUEST).json({
          message: t('Invalid user Id')
        });
      }

      return response.status(Response.HTTP_OK).json({
        message: t('User deleted successfully'),
      });

    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Something went wrong')
      });
    }
  }
  async toggleStatus({ response, params }: HttpContextContract) {
    try {
      const userId = params.userId;
      const user = await User.query()
        .where('uid', userId)
        .first();

      if (user) {
        user.is_active = !user.is_active;
        user.save();

        return response.status(Response.HTTP_OK).json({
          message: t('User status updated'),
          user
        });
      }

    } catch (error) {
      console.log(error)
      return response.status(Response.HTTP_BAD_REQUEST).json({
        message: t('Something went wrong')
      });
    }
  }
}
