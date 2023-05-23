import mongoose from "mongoose";
import postMessage from "../models/postMesssage.model.js";


export const getPost = async (req,res)=>{
        const {page} = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await postMessage.countDocuments({});

        const posts = await postMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
        // sort _id: -1 means order by id desc
        // Skip = offset
        res.status(200).json({
            data:posts,
            currentPage:Number(page),
            numberOfPages:Math.ceil(total/LIMIT)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPostById = async (req,res)=>{
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
        const post = await postMessage.findById(id);
        res.status(200).json({ data:post });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getPostBySearch = async (req,res)=>{
    const {searchQuery,tags} = req.query;
    try {
        const title = new RegExp(searchQuery,'i');
        const posts = await postMessage.find({ $or : [ { title },{ tags: { $in : tags.split(',') } } ] });
        // $or works similar to "where or"
        // $or : [ {CONDITION 1},{CONDITION 2},{CONDITION 3} ]
        // $in use to search array with array
        
        res.status(200).json({ data:posts });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const createPost = async (req,res) => {
    const post = req.body;
    const newPost = new postMessage({...post,creator:req.userId, createdAt:new Date().toISOString()});
    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
export const updatePost = async (req,res)=>{
    const {id:_id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatePost = await postMessage.findByIdAndUpdate(_id,{...post, _id}, {new:true});
    res.json(updatePost);

}

export const deletePost = async (req,res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await postMessage.findByIdAndDelete(id);
    res.json({message:'Post deleted successfully'});
}

export const likePost = async (req,res) => {
    const {id} = req.params;

    if(!req.userId) return res.json({message:'Unauthenticated'});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await postMessage.findById(id);
    const index = post.likes.findIndex((id)=>id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id)=>id !== String(req.userId));
    }

    const updatedPost = await postMessage.findByIdAndUpdate(id,post,{new:true}); 
    res.json(updatedPost);
}

export const commentPost = async (req,res) => {
    const {id} = req.params;
    const {value} = req.body;
    const post = await postMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await postMessage.findByIdAndUpdate(id,post,{ new:true });
    res.json(updatedPost);
}


// export const likePost = async (res,req) => {
// console.log(req.params);

// }


// 16 -bl
// 5.5 -ar --done
// 30 -b --done
// 50 -q --done
// 21 -c -- done
// 20 -m -- done
// 5  -fa
// 9 -w --done

/// 156.5 --out
/// 202 --in
// 45.5 --s

// 90 -59-9-21 = 89
// 40 -5-5-2-10 = 22