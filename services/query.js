/**
 * @Description 
 * This is for run sql query and return the result
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const mysql = require("mysql2");

require('dotenv').config( {path: '.env/dbConfig.env'} );

const query = async ( sql, params ) => {

    const conn = mysql.createConnection( {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DATABASE,
        port: process.env.DBPORT,
        dateStrings: true
    } );
    
    /**
     * @detail
     * sql    (String)  "SELECT column FROM table WHERE column = ? && column = ?"
     * params (Array)   [ value1, value2 ]
     */
    let a = new Promise( resolve => {
        conn.execute(
            sql,
            params,
            function(err, results) {

                if ( err ) {
                    resolve(
                        {
                            status : false,
                            errno : err.errno,
                            err : err
                        }
                    )
                } else {
                    resolve(
                        {
                            status : true,
                            data : results
                        }
                    )
                }

            }
        );
    } );
    conn.end();
    let result = await a;
    return result;

}

module.exports = query;

