package pl.cclite.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class CCWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);

        // Create an Intent to launch MainActivity
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        // Set up the click listener for the whole widget
        views.setOnClickPendingIntent(R.id.widget_logo, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_title, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_play_pause, pendingIntent);

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
