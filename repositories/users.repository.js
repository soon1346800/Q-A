import prisma from '../utiles/prisma.js';
import bcrypt from 'bcrypt';
import { PASSWORD_HASH_SALT_ROUNDS } from '../constants/security.constant.js';

export default class UsersRepository {
  /**
   * 회원 정보 조회
   * @param {*} id
   * @returns
   */
  getMember = async (id) => {
    const selectUser = await prisma.users.findFirst({
      where: {
        id: +id,
      },
    });

    return selectUser;
  };

  createOne = async ({ email, password, role }) => {
    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    delete newUser.password;

    return newUser;
  };

  readOneById = async (id) => {
    const user = await prisma.users.findUnique({ where: { id } });

    return user;
  };

  readOneByEmail = async (email) => {
    const user = await prisma.users.findUnique({ where: { email } });

    return user;
  };
}
