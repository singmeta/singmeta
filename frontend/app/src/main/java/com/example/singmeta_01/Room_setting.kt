package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.singmeta_01.ApiService.ApiService
import com.example.singmeta_01.ApiService.RoomApiService
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException

class Room_setting : AppCompatActivity() {

    //레트로핏 추가 ⭐️
    private val TAG = "MainActivityLog"
    private val URL = "http://192.168.0.2:3006"
    private lateinit var retrofit: Retrofit
    private lateinit var service: RoomApiService

    lateinit var btn_room_finish : Button

    lateinit var edt_RoomTitle : EditText
    lateinit var edt_People : EditText
    lateinit var edt_Password : EditText

    lateinit var edt_pwYN : EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.room_setting)

        btn_room_finish = findViewById(R.id.Btn_room_finish)
        edt_RoomTitle = findViewById(R.id.Edt_RoomTitle)
        edt_People = findViewById(R.id.Edt_People)
        edt_Password = findViewById(R.id.Edt_Password)
        edt_pwYN = findViewById(R.id.Edt_pwYN)

        val theme_num_activity  = intent.getStringExtra("themeNum") // 이걸로 받아오면 됨

        //여기서 제목 인원 비번 받고 나서 레트로핏으로 몽고디비에 넘겨주면 됨

        Toast.makeText(this, theme_num_activity.toString(), Toast.LENGTH_LONG).show()

        //retrofit
        retrofit = Retrofit.Builder()
            .baseUrl(URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        service = retrofit.create(RoomApiService::class.java)




        btn_room_finish.setOnClickListener{
            val themeNum = intent.getStringExtra("themeNum").toString()
            var roomName = edt_RoomTitle.text.toString()
            var headCount = edt_People.text.toString()
            var pw_YN = edt_pwYN.text.toString()
            var pw = edt_Password.text.toString()

            val call_post = service!!.postRoomInfoFunc(themeNum.toInt(), roomName, headCount.toInt(), pw_YN, pw)
            call_post.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        try {
                            val result = response.body()!!.string()
                            Log.v(TAG, "result = $result")
                            Toast.makeText(applicationContext, result, Toast.LENGTH_SHORT)
                                .show()
                        } catch (e: IOException) {
                            e.printStackTrace()
                        }
                    } else {
                        Log.v(TAG, "error = " + response.code().toString())
                        Toast.makeText(
                            applicationContext,
                            "error = " + response.code().toString(),
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Log.v(TAG, "Fail")
                    Toast.makeText(applicationContext, "Response Fail", Toast.LENGTH_SHORT)
                        .show()
                }
            })
        }





    }
}