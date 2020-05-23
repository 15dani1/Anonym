import {Model} from 'radiks';

class PostObj extends Model {
    static className = 'PostObj';
    static schema = {
        username: {
            type:String,
            decrypted:true
        },
        text: {
            type:String,
            decrypted: true
        }
    }
};

export default PostObj;