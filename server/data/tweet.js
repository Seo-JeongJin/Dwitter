import { sequelize } from '../db/database.js';
import { User } from './auth.js';
import SQ from 'sequelize';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define('tweet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Tweet.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.url'), 'url'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
  // return db
  //   .execute(`${SELECT_JOIN} ${ORDER_DESC}`) //
  //   .then((result) => result[0]);
}

// 특정 사용자가 작성한 트윗만 필터링하는 함수
export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
  // return db
  //   .execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username]) //
  //   .then((result) => result[0]);
}

// 특정 ID의 트윗 하나만 조회하는 함수
export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
  // return db
  //   .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id]) //
  //   .then((result) => result[0][0]);
}

// 새로운 트윗을 작성하는 함수
export async function create(text, userId) {
  return Tweet.create({ text, userId }) //
    .then((data) => this.getById(data.dataValues.id));
  // return db
  //   .execute('INSERT INTO tweets (text, createdAt, userId) VALUES(?,?,?)', [
  //     text,
  //     new Date(),
  //     userId,
  //   ])
  //   .then((result) => getById(result[0].insertId));
}

// 트윗 내용을 수정하는 함수
export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      tweet.text = text;
      return tweet.save();
    });
  // return db
  //   .execute('UPDATE tweets SET text=? WHERE id=?', [text, id])
  //   .then(() => getById(id));
}

// 트윗을 삭제하는 함수
export async function remove(id) {
  return Tweet.findByPk(id) //
    .then((tweet) => {
      tweet.destroy();
    });
  // return db.execute('DELETE FROM tweets WHERE id=?', [id]);
}
