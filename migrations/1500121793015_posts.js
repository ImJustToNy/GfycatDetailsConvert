exports.up = (pgm) => {
  pgm.createTable('posts', {
    id: 'id',
    post_id: {
      type: 'varchar',
      unique: true,
      notNull: true
    },
    comment_id: {
      type: 'varchar',
      unique: true,
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('NOW()')
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('posts')
}
