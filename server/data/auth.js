import { sequelize } from '../db/database.js';
import SQ from 'sequelize';

const DataType = SQ.DataTypes;

export const User = sequelize.define(
  'user',
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataType.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataType.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataType.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataType.STRING(128),
      allowNull: false,
    },
    url: DataType.TEXT,
  },
  { timestamps: false },
);

// 회원가입이나 로그인 시, 입력받은 username과 일치하는 유저가 있는지 배열에서 찾아서 반환
export async function findByUsername(username) {
  return User.findOne({ where: { username } });
  // return db
  //   .execute('SELECT * FROM users WHERE username=?', [username]) //
  //   .then((result) => result[0][0]);
}

// 토큰을 검증하거나 특정 유저의 상세 정보가 필요할 때, 고유 id를 이용해 유저를 찾음
export async function findById(id) {
  return User.findByPk(id);
  // return db
  //   .execute('SELECT * FROM users WHERE id=?', [id]) //
  //   .then((result) => result[0][0]);
}

// 새로운 사용자를 생성(회원가입)하는 함수
export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.id);
  // const { username, password, name, email, url } = user;
  // return db
  //   .execute(
  //     'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)',
  //     [username, password, name, email, url],
  //   )
  //   .then((result) => result[0].insertId);
}
