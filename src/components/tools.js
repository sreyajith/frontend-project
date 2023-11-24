import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import InlineCode from '@editorjs/inline-code';
import { uploadImage } from '../common/aws';

const uploadImageByFile=(e)=>{
    return uploadImage(e).then(url=>{
        if(url){
            return{
                success:1,
                file:{url}
            }
        }
    })
}

const uploadImageByURL=(e)=>{
    let link=new Promise((resolve,reject)=>{
        try{
            resolve(e);
        }
        catch(err){
            reject(err);
        }
    })
    return link.then(url=>{
        return{
            success:1,
            file:{url}
        }
    })
}

export const tools={
    embed:Embed,
    list:{
        class:List,
        inlineToolbar: true
    },
    image:{
        class:Image,
        config:{
            uploader:{
                uploadByUrl:uploadImageByURL,
                uploadByFile:uploadImageByFile
            }
        }
    },
    header:{
        class:Header,
        config:{
            placeholder:'Type Heading...',
            defaultLevel:2,
            levels:[2,3]
        }
    },
    quote:{
        class:Quote,
        inlineToolbar: true
    },
    marker:Marker,
    inlinecode:InlineCode
}
