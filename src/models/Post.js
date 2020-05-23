import {Model} from 'radiks';

class PostObj extends Model {
    static className = 'PostObj';
    static schema = {
        username: String,
        title: {
            type: String,
            decrypted: true
        },
        tagline: {
            type:String,
            decrypted: true
        },
        excerpt: {
            type: String,
            decrypted: true
        },
        fileId: {
            type:String,
            decrypted: true
        }
    }
};

export default PostObj;