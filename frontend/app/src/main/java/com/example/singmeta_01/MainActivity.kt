package com.example.singmeta_01

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button

class MainActivity : AppCompatActivity() {
    lateinit var test_btnRoom : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_home)

        test_btnRoom = findViewById(R.id.Test_btnRoom)

        test_btnRoom.setOnClickListener{
            val intentId = Intent(applicationContext, Room_theme::class.java).run {
                startActivity(this)
            }
        }

    }
}