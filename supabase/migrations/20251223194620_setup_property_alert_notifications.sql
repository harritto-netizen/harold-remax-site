/*
  # Setup Property Alert Email Notifications

  1. Changes
    - Creates a trigger function that calls the edge function when a new property alert is inserted
    - Sets up a trigger on the property_alerts table to automatically send notifications
    
  2. How it works
    - When a new row is inserted into property_alerts table
    - The trigger function makes an HTTP request to the edge function
    - The edge function sends an email notification to the admin
    
  3. Notes
    - The edge function URL is automatically configured
    - Email notifications require RESEND_API_KEY and ADMIN_EMAIL to be set in edge function secrets
    - If secrets are not configured, the function will log the alert but not send email
*/

CREATE OR REPLACE FUNCTION notify_property_alert()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  payload jsonb;
BEGIN
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    RAISE WARNING 'Supabase URL or service role key not configured';
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'email', NEW.email,
    'name', NEW.name,
    'phone', NEW.phone,
    'property_type', NEW.property_type,
    'location', NEW.location,
    'price_min', NEW.price_min,
    'price_max', NEW.price_max
  );

  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-property-alert-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to send notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_property_alert_created ON property_alerts;

CREATE TRIGGER on_property_alert_created
  AFTER INSERT ON property_alerts
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_alert();
