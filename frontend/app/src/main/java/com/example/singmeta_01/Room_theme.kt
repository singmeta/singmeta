package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class Room_theme : AppCompatActivity() {

    lateinit var btn_MakeRoom : Button
    lateinit var btn_Theme1 : Button
    lateinit var btn_Theme2 : Button
    lateinit var btn_Theme3 : Button
    lateinit var btn_Theme4 : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.room_theme)

        btn_MakeRoom = findViewById(R.id.Btn_MakeRoom)
        btn_Theme1 = findViewById(R.id.Btn_Theme1)
        btn_Theme2 = findViewById(R.id.Btn_Theme2)
        btn_Theme3 = findViewById(R.id.Btn_Theme3)
        btn_Theme4 = findViewById(R.id.Btn_Theme4)

        val roomIntent = Intent(applicationContext, Room_setting::class.java)

        //테마 선택 리스너
        btn_Theme1.setOnClickListener{
            Toast.makeText(this, "테마 1번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","1");
        }

        btn_Theme2.setOnClickListener{
            Toast.makeText(this, "테마 2번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","2");
        }

        btn_Theme3.setOnClickListener{
            Toast.makeText(this, "테마 3번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","3");
        }

        btn_Theme4.setOnClickListener{
            Toast.makeText(this, "테마 4번이 선택됨", Toast.LENGTH_LONG).show()
            roomIntent.putExtra("themeNum","4");
        }



        btn_MakeRoom.setOnClickListener{
            startActivity(roomIntent)
        }


    }
}