package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore

class Find_id : AppCompatActivity() {

    lateinit var btn_main : Button
    lateinit var btn_find_my_id : Button
    lateinit var comfirm_phone : EditText

    var dbFirestore : FirebaseFirestore? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.find_id)

        dbFirestore = FirebaseFirestore.getInstance()

        btn_main =findViewById(R.id.Btn_main)
        btn_find_my_id = findViewById(R.id.Btn_find_my_id)
        comfirm_phone = findViewById(R.id.Comfirm_phone)

        var comfirmPhoneNum:String = comfirm_phone.text.toString()

        btn_find_my_id.setOnClickListener{
            findId(comfirmPhoneNum)
        }


        btn_main.setOnClickListener{
            onBackPressed()
        }






    }


    fun findId(comfirmPhoneNum:String){
        dbFirestore!!.collection("UserInfoDataBase")
            .get()      // 문서 가져오기
            .addOnSuccessListener { result ->
                // 성공할 경우
                Toast.makeText(this, "블러오기 성공 ", Toast.LENGTH_SHORT).show()
                for (document in result) {  // 가져온 문서들은 result에 들어감
                      if(document["phoneNumber"] as String == comfirm_phone.text.toString()){
                        Toast.makeText(this, document["email"] as String, Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .addOnFailureListener { exception ->
                Toast.makeText(this,"Not Matched!", Toast.LENGTH_SHORT).show()
            }
    }
    
    
    
}