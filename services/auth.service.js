import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
} from '../constants/security.constant.js';
import * as HttpStatus from '../errors/http-status.error.js';
import UsersRepository from '../repositories/users.repository.js';

export class AuthService {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  signup = async ({ email, password, role }) => {
    // 동일 email 확인
    const isExistUser = await this.usersRepository.readOneByEmail(email);
    if (isExistUser) {
      throw new HttpStatus.BadRequest('이미 가입 된 이메일 입니다.');
    }

    // Members 테이블에 email, password를 이용하여 사용자 생성
    const newUser = this.usersRepository.createOne({
      email,
      password,
      role,
    });

    return newUser;
  };

  signin = async ({ email, password }) => {
    const user = await this.usersRepository.readOneByEmail(email);

    const hashedPassword = user?.password ?? '';

    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    const isCorrectUser = user && isPasswordMatched;

    // 일치 여부
    if (!isCorrectUser) {
      throw new HttpStatus.Unauthorized('일치하는 인증 정보가 없습니다.');
    }

    // 로그인 성공시, JWT 발급
    const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    return accessToken;
  };
}
