package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.room_theme.*

class Room_theme : AppCompatActivity() {



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.room_theme)


        val roomIntent = Intent(applicationContext, Room_setting::class.java)

        //테마 선택 리스너
        Btn_Theme1.setOnClickListener{
            Toast.makeText(this, "테마 1번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","1");
        }

        Btn_Theme2.setOnClickListener{
            Toast.makeText(this, "테마 2번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","2");
        }

        Btn_Theme3.setOnClickListener{
            Toast.makeText(this, "테마 3번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","3");
        }

        Btn_Theme4.setOnClickListener{
            Toast.makeText(this, "테마 4번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","4");
        }



        Btn_MakeRoom.setOnClickListener{
            startActivity(roomIntent)
        }


        Btn_main.setOnClickListener{
            onBackPressed()
        }


    }
}