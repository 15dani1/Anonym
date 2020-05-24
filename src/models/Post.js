import {Model} from 'radiks';
import Contestation from './Contestation'

class PostObj extends Model {
    static className = 'PostObj';

    static STATE_UNCONTESTED = 0;
    static STATE_CONTESTED = 1;
    static STATE_REMOVED = 2;

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
        },
        betDelta: {
            type: Number,
            decrypted: true,
        }
    }

    static defaults = {
        state: this.STATE_UNCONTESTED,
        betDelta: 0
    }

    async afterFetch() {
        this.contestations = await Contestation.fetchList({ post_id: this._id})
    }
};

export default PostObj;