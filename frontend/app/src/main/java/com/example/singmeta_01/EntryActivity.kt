package com.example.singmeta_01

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Window
import android.widget.Button
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity


class EntryActivity : AppCompatActivity() {

    lateinit var make_room : Button
    lateinit var room1 : Button
    lateinit var btn_main : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.entry)
        make_room = findViewById(R.id.Make_room)
        btn_main =findViewById(R.id.Btn_main)
        room1 = findViewById(R.id.room1)

        make_room.setOnClickListener{
            val intentId = Intent(applicationContext, Room_theme::class.java).run {
                startActivity(this)
            }
        }

        room1.setOnClickListener{
            showPasswordPopUp()
        }

        btn_main.setOnClickListener{
            onBackPressed()
        }

    }


    private fun showPasswordPopUp(){
        val inflater = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val viewPopup = inflater.inflate(R.layout.popup, null)

        val alertDialog = AlertDialog.Builder(this)
            .create()

        alertDialog.setView(viewPopup)
        alertDialog?.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        alertDialog?.window?.requestFeature(Window.FEATURE_NO_TITLE)
        alertDialog.show()
        alertDialog.window!!.setLayout(1000,500)
    }
}