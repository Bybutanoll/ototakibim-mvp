import { NextResponse } from 'next/server';

export async function GET() {
  const appleAppSiteAssociation = {
    "applinks": {
      "apps": [],
      "details": [
        {
          "appID": "TEAMID.com.ototakibim.app",
          "paths": [
            "/dashboard/*",
            "/vehicles/*",
            "/appointments/*",
            "/work-orders/*",
            "/customers/*",
            "/finance/*",
            "/analytics/*",
            "/reports/*"
          ]
        }
      ]
    },
    "webcredentials": {
      "apps": [
        "TEAMID.com.ototakibim.app"
      ]
    },
    "appclips": {
      "apps": [
        "TEAMID.com.ototakibim.app.Clip"
      ]
    }
  };

  return NextResponse.json(appleAppSiteAssociation, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}