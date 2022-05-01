package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.android.synthetic.main.find_id.*

class Find_id : AppCompatActivity() {

    var dbFirestore : FirebaseFirestore? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.find_id)

        dbFirestore = FirebaseFirestore.getInstance()

        var comfirmPhoneNum:String = Comfirm_phone.text.toString()

        Btn_find_my_id.setOnClickListener{
            FoundUserID.visibility = View.VISIBLE
            findId(comfirmPhoneNum)

        }


        Btn_main.setOnClickListener{
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
                      if(document["phoneNumber"] as String == Comfirm_phone.text.toString()){
                        //Toast.makeText(this, document["email"] as String, Toast.LENGTH_SHORT).show()
                          FoundUserID.setText(document["email"] as String)
                    }
                }
            }
            .addOnFailureListener { exception ->
                Toast.makeText(this,"Not Matched!", Toast.LENGTH_SHORT).show()
            }
    }
    
    
    
}