import {Model} from 'radiks';
import Contestation from './Contestation'

class PostObj extends Model {
    static className = 'PostObj';

    static STATE_UNCONTESTED = 0;
    static STATE_CONTESTED = 1;
    static STATE_REMOVED = 2;

    static TYPE_POST = 0;
    static TYPE_COMMENT = 1;

    static schema = {
        username: String,
        title: {
            type: String,
            decrypted: true,
            required:true
        },
        tagline: {
            type:String,
            decrypted: true,
            required:true
        },
        excerpt: {
            type: String,
            decrypted: true,
            required:true
        },
        fileId: {
            type:String,
            decrypted: true,
            required:true
        },
        author_wallet: {
            type: String,
            decrypted: true,
            required: true
        },
        state: {
            type: Number,
            decrypted: true,
            required: true
        },
        betDelta: {
            type: Number,
            decrypted: true,
        },
        objType: {
            type: Number,
            decrypted: true,
            required: true
        },
        post_id: {
            type: String,
            decrypted: true
        }
    }

    static defaults = {
        state: this.STATE_UNCONTESTED,
        objType: this.TYPE_POST,
        betDelta: 0
    }

    async afterFetch() {
        this.contestations = []
        this.contestations = await Contestation.fetchList({ post_id: this._id})
    }
};

export default PostObj;