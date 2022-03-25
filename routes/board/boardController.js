const pool = require('../../Database/db.js').pool


exports.list = async (req,res)=>{
    const sql = `SELECT idx,cate_name,thumbnail,subject,nickname,DATE_FORMAT(date,'%Y-%m-%d') as date,hit,likes FROM board ORDER BY idx DESC`
    
    let response = {
        errno:1
    }

    try{
        const [result] = await pool.execute(sql)
        
        response = {
            ...response,
            errno:0,
            result
        }
        
    }catch(e){
        console.log(e.message)
    }

    res.json(response)
}

exports.write = async (req,res)=>{
    const {cate_name,subject,content} = req.body
    const {token} = req.cookies
    const [,payload,] = token.split('.')
    const decodingPayload = Buffer.from(payload,'base64').toString()
    const nickname = JSON.parse(decodingPayload).nickname
    
    
    const sql = `INSERT INTO board(cate_name,subject,content,nickname) values(?,?,?,?)`
    const prepare = [cate_name,subject,content,nickname]
    
    let response = {
        result:[],
        errno:0
    }
    try{
        const [result] = await pool.execute(sql,prepare)
        response = {
            ...response,
            result:{
                affectedRows:result.affectedRows,
                insertId:result.insertId
            }
        }
        
    }catch(e){
        console.log(e.message)
        response={
            errno:1
        }
    }

    res.json(response)
}

exports.view = async (req,res)=>{
    console.log(req)
    const {idx} = req.params
    const sql = `SELECT * FROM board WHERE idx=?`
    const prepare = [idx]
    let response = {
        errno:0
    }
    try{
        const [result] = await pool.execute(sql,prepare)
        response = {
            ...response,
            result
        }
    }catch(e){
            {
                console.log(e.message)
                response={
                    errno:1
                }
            }
    }
    res.json(response)
}