import { memo } from 'react';

const Avatar = memo(({ name }) => (
  <div>
    <div className="avatar-txt">{name.charAt(0)}</div>
  </div>
));

export default Avatar;
